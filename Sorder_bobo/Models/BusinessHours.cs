namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BusinessHours
    {
        [StringLength(255)]
        public string BusinessHoursID { get; set; }

        [StringLength(255)]
        public string StoreID { get; set; }

        [StringLength(255)]
        public string Week { get; set; }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public virtual Store Store { get; set; }
    }
}
