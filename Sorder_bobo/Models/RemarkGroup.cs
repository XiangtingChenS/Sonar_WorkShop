namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("RemarkGroup")]
    public partial class RemarkGroup
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public RemarkGroup()
        {
            Remark = new HashSet<Remark>();
        }

        [StringLength(255)]
        public string RemarkGroupID { get; set; }

        [StringLength(255)]
        public string ProductGroupID { get; set; }

        [StringLength(255)]
        public string RemarkGroupTypeName { get; set; }

        public int RemarkGroupDisplayStatus { get; set; }

        public virtual ProductGroup ProductGroup { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Remark> Remark { get; set; }
    }
}
