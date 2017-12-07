namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("OrderDetailRemark")]
    public partial class OrderDetailRemark
    {
        [Key]
        [StringLength(255)]
        public string OrderDetilRemarkID { get; set; }

        [StringLength(255)]
        public string OrderDetailID { get; set; }

        [StringLength(255)]
        public string RemarkID { get; set; }

        public virtual OrderDetail OrderDetail { get; set; }

        public virtual Remark Remark { get; set; }
    }
}
