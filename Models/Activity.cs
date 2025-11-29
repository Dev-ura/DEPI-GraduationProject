using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class Activity
{
    public Guid ActivityId { get; set; }

    public string ActivityType { get; set; } = null!;

    public int ActivityPoints { get; set; }

    public virtual ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
}
