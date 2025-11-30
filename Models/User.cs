using Microsoft.AspNetCore.Identity;

namespace Account_Test.Models
{
    public class User : IdentityUser
    {
        public string? ProfileImageUrl { get; set; }
        public Guid? LevelId { get; set; }
        public int? CurrentPoints { get; set; }
        public DateOnly? LastLoginDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }



        public ICollection<Note> Notes { get; set; } = new List<Note>();
        public ICollection<Todo> Todos { get; set; } = new List<Todo>();
        public ICollection<Plan> Plans { get; set; } = new List<Plan>();
    }
}
