using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class Note
{
    public Guid NoteId { get; set; }

    public Guid UserId { get; set; }

    public string? Title { get; set; }

    public string? ContentMarkdown { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Category { get; set; }

    public virtual User User { get; set; } = null!;
}
