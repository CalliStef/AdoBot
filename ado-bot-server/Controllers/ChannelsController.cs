using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using ado_bot_server.Models;
using ado_bot_server.Hubs;

namespace ado_bot_server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChannelsController : ControllerBase
{
    private readonly DatabaseContext _context;

    private readonly IHubContext<ChannelHub> _hub;

    // accept the hub here
    // a constructor with the hub and the database as a  parameter

    public ChannelsController(DatabaseContext context, IHubContext<ChannelHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Channel>>> GetChannels()
    {
        
        // get all channels with their users
        var Channels = await _context.Channels.Include(c => c.Users).ToListAsync();

        return Channels;
        // return await _context.Channels.ToListAsync();
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Channel>> GetChannel(int id)
    {
        // var Channel = await _context.Channels.FindAsync(id);
        var Channel = await _context.Channels.Where(c => c.Id == id).Include(c => c.Users).Include(c => c.Posts).ThenInclude(m => m.User).FirstOrDefaultAsync();
        
        // _context.Entry(Channel).Collection("Posts").Load();

        if (Channel == null)
        {
            return NotFound();
        }
        
        

        return Channel;
    }

    // get channels by creator id
    [HttpGet("creator/{id}")]
    public async Task<ActionResult<IEnumerable<Channel>>> GetChannelsByCreator(int id)
    {
        // var Channel = await _context.Channels.FindAsync(id);
        var Channels = await _context.Channels.Where(c => c.CreatorId == id).ToListAsync();
        
        // _context.Entry(Channel).Collection("Posts").Load();

        if (Channels == null)
        {
            return NotFound();
        }
        
        return Channels;
    }

    [HttpPost]
    public async Task<ActionResult<Channel>> PostChannel(Channel Channel)
    {

        _context.Channels.Add(Channel);
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("ChannelCreated", Channel);

        return CreatedAtAction(nameof(GetChannel), new { id = Channel.Id }, Channel);
    }

    // POST: api/Channels/5/Posts
    [HttpPost("{channelId}/Posts")]
    public async Task<Post> PostChannelPost(int channelId, Post post)
    {
        post.ChannelId = channelId;
        _context.Posts.Add(post);
 
        await _context.SaveChangesAsync();

        var channel = await _context.Channels.FindAsync(post.ChannelId);

        var newPost = await  _context.Posts.Where(m => m.Id == post.Id).Include(m => m.User).FirstOrDefaultAsync();

        // return CreatedAtAction("GetPost", "Post", new { id = Channel.Id }, Channel);
        // Broadcast this to all SignalR clients
        // await _hub.Clients.All.SendAsync("ReceivePost", Post);
        await _hub.Clients.All.SendAsync("PostAdded", newPost);

        
        // await _hub.Clients.Group(channel.Name).SendAsync("ReceivePost", message);
        return post;
    }

    // POST: api/Channels/5/Users
    [HttpPost("{channelId}/Users")]
    public async Task<User> PostChannelUser(int channelId, User user)
    {
        // user.ChannelId = channelId;
        var channel = await _context.Channels.FindAsync(channelId);
        user.Channels.Add(channel);
        channel.Users.Add(user);


        await _context.SaveChangesAsync();

        var newUser = await  _context.Users.Where(u => u.Id == user.Id).Include(u => u.Channels).FirstOrDefaultAsync();
        
     
        await _hub.Clients.Group(channelId.ToString()).SendAsync("UserJoined", newUser);
        
        // await _hub.Clients.Group(channel.Name).SendAsync("ReceivePost", message);
        return user;
    }

    // DELETE: api/Channels/5/Users
    [HttpDelete("{channelId}/Users/{userId}")]
    public async Task<User> DeleteChannelUser(int channelId, User user)
    {
        var channel = await _context.Channels.FindAsync(channelId);
        // var user = await _context.Users.FindAsync(userId);
        user.Channels.Remove(channel);
        channel.Users.Remove(user);

        await _context.SaveChangesAsync();
        await _hub.Clients.Group(channelId.ToString()).SendAsync("UserLeft", user);
        
        // await _hub.Clients.Group(channel.Name).SendAsync("ReceivePost", message);
        return user;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutChannel(int id, Channel Channel)
    {
        if (id != Channel.Id)
        {
            return BadRequest();
        }

        _context.Entry(Channel).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("ChannelUpdated", Channel);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteChannel(int id)
    {
        var Channel = await _context.Channels.FindAsync(id);
        if (Channel == null)
        {
            return NotFound();
        }

        _context.Channels.Remove(Channel);
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("ChannelDeleted", Channel.Id);

        return NoContent();
    }
}