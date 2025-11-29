using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class Aichat
{
    public Guid ChatId { get; set; }

    public Guid UserId { get; set; }

    public string MessageContent { get; set; } = null!;

    public string? Sender { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
