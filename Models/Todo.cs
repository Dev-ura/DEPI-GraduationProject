namespace Account_Test.Models
{
    public class Todo
    {
        public Guid TodoId { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public bool? IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Category { get; set; }

        public User User { get; set; }
    }
}
