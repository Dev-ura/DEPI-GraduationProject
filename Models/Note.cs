namespace Account_Test.Models
{
    public class Note
    {
        public Guid NoteId { get; set; }
        public string UserId { get; set; }
        public string? Title { get; set; }
        public string? ContentMarkdown { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Category { get; set; }

        public User? User { get; set; }
    }
}
