
namespace ado_bot_server.Models;

public class User
{

    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Photo { get; set; } = null!;

    public DateTime Created { get; set; }

    public DateTime Updated { get; set; }

    public ICollection<Channel> Channels { get; set; } 
}