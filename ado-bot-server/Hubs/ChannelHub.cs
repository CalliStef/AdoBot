using Microsoft.AspNetCore.SignalR;

namespace ado_bot_server.Hubs;

public class ChannelHub : Hub
{

    // allow someone to connect to a specific group

    public override Task OnConnectedAsync()
    {
        Console.WriteLine("A Client Connected: " + Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        Console.WriteLine("A client disconnected: " + Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string message)
    {
        Console.WriteLine("Message Received: " + message);
        // await Clients.Group(groupName).SendAsync("ReceiveMessage", message);
        // await Clients.Group(groupName).SendAsync(message);
        //return message
    }

    public async Task AddToGroup(int groupId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
        // await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId}");
    }

    public async Task RemoveFromGroup(int groupId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId.ToString());
        // await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId}")
    }

    
}
