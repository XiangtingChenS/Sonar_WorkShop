namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Remark")]
    public partial class Remark
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Remark()
        {
            OrderDetailRemark = new HashSet<OrderDetailRemark>();
        }

        [StringLength(255)]
        public string RemarkID { get; set; }

        [StringLength(255)]
        public string RemarkName { get; set; }

        public int RemarkDisplayStatus { get; set; }

        [StringLength(255)]
        public string RemarkGroupID { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<OrderDetailRemark> OrderDetailRemark { get; set; }

        public virtual RemarkGroup RemarkGroup { get; set; }
    }
}
