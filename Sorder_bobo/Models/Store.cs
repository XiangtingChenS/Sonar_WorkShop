namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Store")]
    public partial class Store
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Store()
        {
            BusinessHours = new HashSet<BusinessHours>();
            Orders = new HashSet<Orders>();
            ProductGroup = new HashSet<ProductGroup>();
        }

        [StringLength(255)]
        public string StoreID { get; set; }

        [StringLength(255)]
        public string StoreName { get; set; }

        [StringLength(255)]
        public string StorePhone { get; set; }

        [Column(TypeName = "text")]
        public string StoreImage { get; set; }

        [StringLength(255)]
        public string StoreKeeper { get; set; }

        [StringLength(255)]
        public string Address { get; set; }

        [StringLength(255)]
        public string StoreInformation { get; set; }

        [Required]
        [StringLength(255)]
        public string StoreAccount { get; set; }

        [Required]
        [StringLength(255)]
        public string StorePassword { get; set; }

        [Required]
        [StringLength(255)]
        public string Unit { get; set; }

        public int OrderQuantity { get; set; }

        public int IntervalTime { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BusinessHours> BusinessHours { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Orders> Orders { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ProductGroup> ProductGroup { get; set; }
    }
}
