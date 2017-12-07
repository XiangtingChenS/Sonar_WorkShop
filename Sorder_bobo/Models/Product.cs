namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Product")]
    public partial class Product
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Product()
        {
            OrderDetail = new HashSet<OrderDetail>();
        }

        [StringLength(255)]
        public string ProductID { get; set; }

        [StringLength(255)]
        public string ProductName { get; set; }

        public int ProductStatus { get; set; }

        public int ProductPrice { get; set; }

        [Column(TypeName = "text")]
        public string ProductImage { get; set; }

        public DateTime ProductCreateDateTime { get; set; }

        [StringLength(255)]
        public string ProductGroupID { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<OrderDetail> OrderDetail { get; set; }

        public virtual ProductGroup ProductGroup { get; set; }
    }
}
