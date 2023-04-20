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

        modelBuilder.Entity<Channel>()
            .HasOne(e => e.Creator)
            .WithMany(e => e.ChannelsCreated)
            .HasForeignKey(e => e.CreatorId);

        modelBuilder.Entity<Channel>()
            .HasMany(e => e.Users)
            .WithMany(e => e.Channels);

    }

    public DbSet<Channel> Channels => Set<Channel>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<User> Users => Set<User>();
}