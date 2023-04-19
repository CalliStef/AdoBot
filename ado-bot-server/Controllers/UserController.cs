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
        var User = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

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
    public async Task<ActionResult<User>> LoginUser(User User)
    {
        // check if username already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Username);

        if (existingUser == null)
        {
            return NotFound("User not found");
        }

        if (existingUser.Password != User.Password)
        {
            return Unauthorized("Incorrect password");
        }

        return existingUser;
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