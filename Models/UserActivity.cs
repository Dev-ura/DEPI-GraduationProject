using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class UserActivity
{
    public Guid UserativityId { get; set; }

    public Guid UserId { get; set; }

    public Guid ActivityId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Activity Activity { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
