using ado_bot_server.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using ado_bot_server.Models;
using ado_bot_server.Hubs;

namespace Concord.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly DatabaseContext _context;

    private readonly IHubContext<ChannelHub> _hub;

    // accept the hub here
    // a constructor with the hub and the database as a  parameter

    public UsersController(DatabaseContext context, IHubContext<ChannelHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var User = await _context.Users.FindAsync(id);

        if (User == null)
        {
            return NotFound();
        }

        return User;
    }

    [HttpGet]
    [Route("username/{username}")]
    public async Task<ActionResult<User>> GetUserByUsername(string username)
    {
        // get the user by username along with the channels they are in and the channels they created
        var User = await _context.Users.Where(u => u.Username == username).Include(u => u.Channels).Include(u => u.Channels).FirstOrDefaultAsync();
        // var User = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (User == null)
        {
            return NotFound();
        }

        return User;
    }

    [HttpPost]
    public async Task<ActionResult<User>> PostUser(User User)
    {

        // check if username already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Username);

        if (existingUser != null)
        {
            return Conflict("Username already exists");
        }

        _context.Users.Add(User);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = User.Id }, User);
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<User>> LoginUser(User user)
    {
        // check if username already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

        if (existingUser == null)
        {
            return NotFound("User not found");
        }

        if (existingUser.Password != user.Password)
        {
            return Unauthorized("Incorrect password");
        }

        return existingUser;
    }

    // POST api/users/join
    [HttpPost]
    [Route("join")]
    public async Task<ActionResult<User>> JoinChannel(JoinChannelRequestDTO requestDto)
    {
        
        
        var user = await _context.Users.FindAsync(requestDto.UserId);
        var channel = await _context.Channels.FindAsync(requestDto.ChannelId);

        if (user == null || channel == null)
        {
            return NotFound("User or channel not found");
        }

        // Add user to channel
        user.Channels.Add(channel);

        // Add channel to user
        channel.Users.Add(user);
        
        await _context.SaveChangesAsync();

        // Broadcast this to only the SignalR clients in the channel
        await _hub.Clients.Group(requestDto.ChannelId.ToString()).SendAsync("UserJoined", user);

        return user;
    }

    // POST api/users/leave
    [HttpPost]
    [Route("leave")]
    public async Task<ActionResult<User>> LeaveChannel(JoinChannelRequestDTO requestDto)
    {
        var user = await _context.Users.FindAsync(requestDto.UserId);
        var channel = await _context.Channels.FindAsync(requestDto.ChannelId);

        if (user == null || channel == null)
        {
            return NotFound();
        }

        user.Channels.Remove(channel);
        channel.Users.Remove(user);

        await _context.SaveChangesAsync();

        // Broadcast this to only the SignalR clients in the channel
        await _hub.Clients.Group(requestDto.ChannelId.ToString()).SendAsync("UserLeft", user);

        return user;
    }

// // POST: api/Users/5/Users
//     [HttpPost("{UserId}/Users")]
//     public async Task<User> PostUser(int UserId, User User)
//     {
//         User.UserId = UserId;
//         _context.Users.Add(User);
//         await _context.SaveChangesAsync();

//         // return CreatedAtAction("GetUser", "User", new { id = User.Id }, User);
//         // Broadcast this to all SignalR clients
//         // await _hub.Clients.All.SendAsync("ReceiveUser", User);
//         await _hub.Clients.Group(UserId.ToString()).SendAsync("ReceiveUser", User);

//         return User;
//     }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(int id, User User)
    {
        if (id != User.Id)
        {
            return BadRequest();
        }

        _context.Entry(User).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("UserUpdated", User);

        // await _hub.Clients.Group(User.ChannelId.ToString()).SendAsync("UserUpdated", User);/

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var User = await _context.Users.FindAsync(id);
        if (User == null)
        {
            return NotFound();
        }

        _context.Users.Remove(User);
        await _context.SaveChangesAsync();

        // await _hub.Clients.Group(User.ChannelId.ToString()).SendAsync("UserDeleted", User.Id);

        return NoContent();
    }
}