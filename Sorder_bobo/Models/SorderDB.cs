namespace Sorder_bobo.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class SorderDB : DbContext
    {
        public SorderDB()
            : base("name=SorderDB")
        {
        }

        public virtual DbSet<BusinessHours> BusinessHours { get; set; }
        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<OrderDetail> OrderDetail { get; set; }
        public virtual DbSet<OrderDetailRemark> OrderDetailRemark { get; set; }
        public virtual DbSet<Orders> Orders { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<ProductGroup> ProductGroup { get; set; }
        public virtual DbSet<Remark> Remark { get; set; }
        public virtual DbSet<RemarkGroup> RemarkGroup { get; set; }
        public virtual DbSet<Store> Store { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BusinessHours>()
                .Property(e => e.BusinessHoursID)
                .IsUnicode(false);

            modelBuilder.Entity<BusinessHours>()
                .Property(e => e.StoreID)
                .IsUnicode(false);

            modelBuilder.Entity<BusinessHours>()
                .Property(e => e.Week)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.CustomerID)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.CustomerName)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.CustomerPhone)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.CustomerAccount)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.CustomerPassword)
                .IsUnicode(false);

            modelBuilder.Entity<OrderDetail>()
                .Property(e => e.OrderDetailID)
                .IsUnicode(false);

            modelBuilder.Entity<OrderDetail>()
                .Property(e => e.OrderID)
                .IsUnicode(false);

            modelBuilder.Entity<OrderDetail>()
                .Property(e => e.ProductID)
                .IsUnicode(false);

            modelBuilder.Entity<OrderDetailRemark>()
                .Property(e => e.OrderDetilRemarkID)
                .IsUnicode(false);

            modelBuilder.Entity<OrderDetailRemark>()
                .Property(e => e.OrderDetailID)
                .IsUnicode(false);

            modelBuilder.Entity<OrderDetailRemark>()
                .Property(e => e.RemarkID)
                .IsUnicode(false);

            modelBuilder.Entity<Orders>()
                .Property(e => e.OrderID)
                .IsUnicode(false);

            modelBuilder.Entity<Orders>()
                .Property(e => e.CustomerID)
                .IsUnicode(false);

            modelBuilder.Entity<Orders>()
                .Property(e => e.StoreID)
                .IsUnicode(false);

            modelBuilder.Entity<Orders>()
                .Property(e => e.NFC)
                .IsUnicode(false);

            modelBuilder.Entity<Orders>()
                .Property(e => e.QRcode)
                .IsUnicode(false);

            modelBuilder.Entity<Orders>()
                .Property(e => e.Remark)
                .IsUnicode(false);

            modelBuilder.Entity<Product>()
                .Property(e => e.ProductID)
                .IsUnicode(false);

            modelBuilder.Entity<Product>()
                .Property(e => e.ProductName)
                .IsUnicode(false);

            modelBuilder.Entity<Product>()
                .Property(e => e.ProductImage)
                .IsUnicode(false);

            modelBuilder.Entity<Product>()
                .Property(e => e.ProductGroupID)
                .IsUnicode(false);

            modelBuilder.Entity<ProductGroup>()
                .Property(e => e.ProductGroupID)
                .IsUnicode(false);

            modelBuilder.Entity<ProductGroup>()
                .Property(e => e.ProductGroupTypeName)
                .IsUnicode(false);

            modelBuilder.Entity<ProductGroup>()
                .Property(e => e.StoreID)
                .IsUnicode(false);

            modelBuilder.Entity<Remark>()
                .Property(e => e.RemarkID)
                .IsUnicode(false);

            modelBuilder.Entity<Remark>()
                .Property(e => e.RemarkName)
                .IsUnicode(false);

            modelBuilder.Entity<Remark>()
                .Property(e => e.RemarkGroupID)
                .IsUnicode(false);

            modelBuilder.Entity<RemarkGroup>()
                .Property(e => e.RemarkGroupID)
                .IsUnicode(false);

            modelBuilder.Entity<RemarkGroup>()
                .Property(e => e.ProductGroupID)
                .IsUnicode(false);

            modelBuilder.Entity<RemarkGroup>()
                .Property(e => e.RemarkGroupTypeName)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StoreID)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StoreName)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StorePhone)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StoreImage)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StoreKeeper)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.Address)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StoreInformation)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StoreAccount)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.StorePassword)
                .IsUnicode(false);

            modelBuilder.Entity<Store>()
                .Property(e => e.Unit)
                .IsUnicode(false);
        }
    }
}
