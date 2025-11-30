namespace Account_Test.Models
{
    public class Plan
    {
        public Guid PlanId { get; set; }
        public string UserId { get; set; } = null!;
        public string Title { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public ICollection<Todo> Todos { get; set; } = new List<Todo>();
    }
}
