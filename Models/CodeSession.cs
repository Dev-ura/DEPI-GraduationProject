using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class CodeSession
{
    public Guid SessionId { get; set; }

    public Guid UserId { get; set; }

    public string? CodeContent { get; set; }

    public string? Language { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
