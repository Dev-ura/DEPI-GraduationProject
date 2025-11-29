using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class Todo
{
    public Guid TodoId { get; set; }

    public Guid UserId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsCompleted { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Category { get; set; }

    public virtual User User { get; set; } = null!;
}
