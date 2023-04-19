
namespace ado_bot_server.Models;

public class User
{

    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Photo { get; set; } = "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";

    public DateTime Created { get; set; }

    public DateTime Updated { get; set; }

    
    public ICollection<Channel> ChannelsCreated { get; set; } = new List<Channel>();
 
    public ICollection<Channel> Channels { get; set; } = new List<Channel>();

}