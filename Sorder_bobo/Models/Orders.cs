namespace Sorder_bobo.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Orders
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Orders()
        {
            OrderDetail = new HashSet<OrderDetail>();
        }

        [Key]
        [StringLength(255)]
        public string OrderID { get; set; }

        [StringLength(255)]
        public string CustomerID { get; set; }

        [StringLength(255)]
        public string StoreID { get; set; }

        [StringLength(255)]
        public string NFC { get; set; }

        public DateTime OrderDateTime { get; set; }

        public int Status { get; set; }

        [Column(TypeName = "text")]
        public string QRcode { get; set; }

        public DateTime DeliveryDateTime { get; set; }

        [StringLength(255)]
        public string Remark { get; set; }

        public int HoldOrderQuantity { get; set; }

        public virtual Customer Customer { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<OrderDetail> OrderDetail { get; set; }

        public virtual Store Store { get; set; }
    }
}
