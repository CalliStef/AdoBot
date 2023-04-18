using Microsoft.EntityFrameworkCore;

namespace ado_bot_server.Models;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Channel>().Property(e => e.Created).HasDefaultValueSql("now()");

        modelBuilder.Entity<Post>().Property(e => e.Created).HasDefaultValueSql("now()");

        modelBuilder.Entity<User>().Property(e => e.Created).HasDefaultValueSql("now()");
        modelBuilder.Entity<User>().Property(e => e.Updated).HasDefaultValueSql("now()");

    }

    public DbSet<Channel> Channels => Set<Channel>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<User> Users => Set<User>();
}