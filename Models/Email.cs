using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class Email
{
    public Guid EmailId { get; set; }

    public Guid UserId { get; set; }

    public string Subject { get; set; } = null!;

    public string Body { get; set; } = null!;

    public DateTime? SentAt { get; set; }

    public string? Status { get; set; }

    public virtual User User { get; set; } = null!;
}
