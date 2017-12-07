namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ProductGroup")]
    public partial class ProductGroup
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ProductGroup()
        {
            Product = new HashSet<Product>();
            RemarkGroup = new HashSet<RemarkGroup>();
        }

        [StringLength(255)]
        public string ProductGroupID { get; set; }

        [StringLength(255)]
        public string ProductGroupTypeName { get; set; }

        public int ProductGroupRemarkStatus { get; set; }

        public int ProductGroupDisplayStatus { get; set; }

        [StringLength(255)]
        public string StoreID { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Product> Product { get; set; }

        public virtual Store Store { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RemarkGroup> RemarkGroup { get; set; }
    }
}
