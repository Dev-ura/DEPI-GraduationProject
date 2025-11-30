using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Account_Test.Models;

namespace Account_Test.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; }
        public DbSet<Todo> Todos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Activities
       
            // Users
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.Property(e => e.CurrentPoints).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("getdate()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("getdate()");

            
            });

            // AIChats
          

            // CodeSessions
           

            // Emails
          

           
            // Notes
            modelBuilder.Entity<Note>(entity =>
            {
                entity.ToTable("Notes");
                entity.HasKey(e => e.NoteId);
                entity.Property(e => e.NoteId).HasDefaultValueSql("newid()");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("getdate()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("getdate()");
                entity.Property(e => e.Title).HasMaxLength(255);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.Notes)
                      .HasForeignKey(e => e.UserId);
            });

            // Todos
            modelBuilder.Entity<Todo>(entity =>
            {
                entity.ToTable("Todos");
                entity.HasKey(e => e.TodoId);
                entity.Property(e => e.TodoId).HasDefaultValueSql("newid()");
                entity.Property(e => e.IsCompleted).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("getdate()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("getdate()");

                entity.HasOne(e => e.User)
                      .WithMany(u => u.Todos)
                      .HasForeignKey(e => e.UserId);
            });

          
        }

    }
}
