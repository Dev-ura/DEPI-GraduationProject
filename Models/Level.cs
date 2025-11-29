using System;
using System.Collections.Generic;

namespace Codexly.Models;

public partial class Level
{
    public Guid LevelId { get; set; }

    public string LevelName { get; set; } = null!;

    public int? LevelNumber { get; set; }

    public int PointsRequired { get; set; }

    public string? Description { get; set; }

    public string? LogoUrl { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
