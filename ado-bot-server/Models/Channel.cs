namespace ado_bot_server.Models;

public class Channel
{
    public Channel(int id, string name, DateTime created)
    {
        Id = id;
        Name = name;
        Created = created;
        Posts = new List<Post>();
    }

    public int Id { get; set; }
    public string Name { get; set; } 
    public DateTime Created { get; set; }
    public List<Post> Posts { get; set; }
    public int Totalusers { get; set; }
    public int Totalposts { get; set; }
    public int CreatorId { get; set; }
    public User? Creator { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
 
}
