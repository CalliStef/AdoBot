using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using ado_bot_server.Models;
using ado_bot_server.Hubs;

namespace ado_bot_server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly DatabaseContext _context;

    private readonly IHubContext<ChannelHub> _hub;

    // accept the hub here
    // a constructor with the hub and the database as a  parameter

    public PostsController(DatabaseContext context, IHubContext<ChannelHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
    {
        return await _context.Posts.ToListAsync();
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Post>> GetPost(int id)
    {
        var Post = await _context.Posts.FindAsync(id);

        if (Post == null)
        {
            return NotFound();
        }

        return Post;
    }

    [HttpPost]
    public async Task<ActionResult<Post>> PostPost(Post Post)
    {
        _context.Posts.Add(Post);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPost), new { id = Post.Id }, Post);
    }
    
    // get post by channel id
    [HttpGet]
    [Route("channel/{channelId}")]
    public async Task<ActionResult<IEnumerable<Post>>> GetPostsByChannelId(int channelId)
    {
        var Posts = await _context.Posts.Where(p => p.ChannelId == channelId).ToListAsync();

        if (Posts == null)
        {
            return NotFound();
        }

        return Posts;
    }

// // POST: api/Posts/5/Posts
//     [HttpPost("{PostId}/Posts")]
//     public async Task<Post> PostPost(int PostId, Post Post)
//     {
//         Post.PostId = PostId;
//         _context.Posts.Add(Post);
//         await _context.SaveChangesAsync();

//         // return CreatedAtAction("GetPost", "Post", new { id = Post.Id }, Post);
//         // Broadcast this to all SignalR clients
//         // await _hub.Clients.All.SendAsync("ReceivePost", Post);
//         await _hub.Clients.Group(PostId.ToString()).SendAsync("ReceivePost", Post);

//         return Post;
//     }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPost(int id, Post Post)
    {
        if (id != Post.Id)
        {
            return BadRequest();
        }

        _context.Entry(Post).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        await _hub.Clients.Group(Post.ChannelId.ToString()).SendAsync("PostUpdated", Post);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var Post = await _context.Posts.FindAsync(id);
        if (Post == null)
        {
            return NotFound();
        }

        _context.Posts.Remove(Post);
        await _context.SaveChangesAsync();

        await _hub.Clients.Group(Post.ChannelId.ToString()).SendAsync("PostDeleted", Post.Id);

        return NoContent();
    }
}