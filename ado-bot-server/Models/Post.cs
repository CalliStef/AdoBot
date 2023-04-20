namespace ado_bot_server.Models;

public class Post
{
    public Post(int id, string title, string content, DateTime created)
    {
        Id = id;
        Title= title;
        Content = content;
        Created = created;
    }

    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public DateTime Created { get; set; }
    public int ChannelId { get; set; }
    public Channel? Channel { get; set; }
}