using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace CIS.Data.Database
{
    public partial class B2SDBContext : DbContext
    {
        public B2SDBContext()
        {
        }

        public B2SDBContext(DbContextOptions<B2SDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ApiauditLog> ApiauditLogs { get; set; }
        public virtual DbSet<TblAuditLog> TblAuditLogs { get; set; }
        public virtual DbSet<TblAuditLogObp> TblAuditLogObps { get; set; }
        public virtual DbSet<TblBinLocation> TblBinLocations { get; set; }
        public virtual DbSet<TblBinLocationDetail> TblBinLocationDetails { get; set; }
        public virtual DbSet<TblCategory> TblCategories { get; set; }
        public virtual DbSet<TblDbfdataStaging> TblDbfdataStagings { get; set; }
        public virtual DbSet<TblDbfdatum> TblDbfdata { get; set; }
        public virtual DbSet<TblEmployee> TblEmployees { get; set; }
        public virtual DbSet<TblErrorLog> TblErrorLogs { get; set; }
        public virtual DbSet<TblFgmaster> TblFgmasters { get; set; }
        public virtual DbSet<TblFgpalletCapacity> TblFgpalletCapacities { get; set; }
        public virtual DbSet<TblFileUploadLog> TblFileUploadLogs { get; set; }
        public virtual DbSet<TblGlobalVariableSetting> TblGlobalVariableSettings { get; set; }
        public virtual DbSet<TblGlove> TblGloves { get; set; }
        public virtual DbSet<TblJournal> TblJournals { get; set; }
        public virtual DbSet<TblLine> TblLines { get; set; }
        public virtual DbSet<TblLocation> TblLocations { get; set; }
        public virtual DbSet<TblPallet> TblPallets { get; set; }
        public virtual DbSet<TblPrinterSetting> TblPrinterSettings { get; set; }
        public virtual DbSet<TblReason> TblReasons { get; set; }
        public virtual DbSet<TblStationPc> TblStationPcs { get; set; }
        public virtual DbSet<TblStockCartonDetail> TblStockCartonDetails { get; set; }
        public virtual DbSet<TblStockCartonDetailsBak> TblStockCartonDetailsBaks { get; set; }
        public virtual DbSet<TblStockCartonDetailsBak181127> TblStockCartonDetailsBak181127s { get; set; }
        public virtual DbSet<TblStockDetail> TblStockDetails { get; set; }
        public virtual DbSet<TblStockDetailsBak> TblStockDetailsBaks { get; set; }
        public virtual DbSet<TblStockDetailsBak181127> TblStockDetailsBak181127s { get; set; }
        public virtual DbSet<TblStockDetailsBk05042019> TblStockDetailsBk05042019s { get; set; }
        public virtual DbSet<TblStockMaster> TblStockMasters { get; set; }
        public virtual DbSet<TblStockMasterBak> TblStockMasterBaks { get; set; }
        public virtual DbSet<TblStockMasterBak181127> TblStockMasterBak181127s { get; set; }
        public virtual DbSet<TblStockTransaction> TblStockTransactions { get; set; }
        public virtual DbSet<TblStockTransactionBak> TblStockTransactionBaks { get; set; }
        public virtual DbSet<TblStockTransactionBak181127> TblStockTransactionBak181127s { get; set; }
        public virtual DbSet<TblSysLog> TblSysLogs { get; set; }
        public virtual DbSet<TblUser> TblUsers { get; set; }
        public virtual DbSet<TblUserLocation> TblUserLocations { get; set; }
        public virtual DbSet<TblUserLog> TblUserLogs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("server=HSD-SVR-0051-V;Database=B2SDB;Integrated Security=SSPI;MultipleActiveResultSets=True;User Id=mpp_user;Password=mpp_user!@#;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<ApiauditLog>(entity =>
            {
                entity.ToTable("APIAuditLog");

                entity.Property(e => e.ApiauditLogId).HasColumnName("APIAuditLogId");

                entity.Property(e => e.Apifunction).HasColumnName("APIFunction");

                entity.Property(e => e.Apioperation).HasColumnName("APIOperation");
            });

            modelBuilder.Entity<TblAuditLog>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblAuditLog");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Module)
                    .HasMaxLength(50)
                    .IsFixedLength(true);

                entity.Property(e => e.SerialNo)
                    .HasMaxLength(50)
                    .IsFixedLength(true);

                entity.Property(e => e.Type)
                    .HasMaxLength(20)
                    .IsFixedLength(true);

                entity.Property(e => e.Workstation)
                    .HasMaxLength(100)
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<TblAuditLogObp>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblAuditLog_obp");

                entity.Property(e => e.CartonNo)
                    .HasMaxLength(5)
                    .IsFixedLength(true);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.LotNo)
                    .HasMaxLength(50)
                    .IsFixedLength(true);

                entity.Property(e => e.Module)
                    .HasMaxLength(50)
                    .IsFixedLength(true);

                entity.Property(e => e.Type)
                    .HasMaxLength(20)
                    .IsFixedLength(true);

                entity.Property(e => e.Workstation)
                    .HasMaxLength(100)
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<TblBinLocation>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblBinLocation");

                entity.Property(e => e.BinDid).HasColumnName("BinDID");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.BinLocationName).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");
            });

            modelBuilder.Entity<TblBinLocationDetail>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblBinLocationDetails");

                entity.Property(e => e.BinDid).HasColumnName("BinDID");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

                entity.Property(e => e.EmployeeId2).HasColumnName("EmployeeID2");

                entity.Property(e => e.InDate).HasColumnType("datetime");

                entity.Property(e => e.LocationIdin).HasColumnName("LocationIDIn");

                entity.Property(e => e.LocationIdout).HasColumnName("LocationIDOut");

                entity.Property(e => e.OutDate).HasColumnType("datetime");

                entity.Property(e => e.StationName).HasMaxLength(50);

                entity.Property(e => e.StationName2).HasMaxLength(50);

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.UserId2).HasColumnName("UserID2");
            });

            modelBuilder.Entity<TblCategory>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblCategory");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName).HasMaxLength(50);

                entity.Property(e => e.ReferFg).HasColumnName("ReferFG");

                entity.Property(e => e.ReferFgboxPerCarton).HasColumnName("ReferFGBoxPerCarton");

                entity.Property(e => e.ReferFgpackingSize).HasColumnName("ReferFGPackingSize");
            });

            modelBuilder.Entity<TblDbfdataStaging>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblDBFData_Staging");

                entity.Property(e => e.Fgcode)
                    .HasMaxLength(15)
                    .HasColumnName("FGCode");
            });

            modelBuilder.Entity<TblDbfdatum>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblDBFData");

                entity.Property(e => e.DateInserted).HasColumnType("datetime");

                entity.Property(e => e.Fgcode)
                    .HasMaxLength(15)
                    .HasColumnName("FGCode");
            });

            modelBuilder.Entity<TblEmployee>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblEmployee");

                entity.Property(e => e.EmployeeId)
                    .HasMaxLength(50)
                    .HasColumnName("EmployeeID");

                entity.Property(e => e.EmployeeName).HasMaxLength(50);

                entity.Property(e => e.SyncDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<TblErrorLog>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblErrorLog");

                entity.Property(e => e.Ipaddress)
                    .HasMaxLength(50)
                    .HasColumnName("IPAddress");

                entity.Property(e => e.LogDateTime).HasColumnType("datetime");

                entity.Property(e => e.Page).HasMaxLength(50);

                entity.Property(e => e.StationName).HasMaxLength(100);

                entity.Property(e => e.SystemName)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblFgmaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblFGMaster");

                entity.Property(e => e.Fgbrand).HasColumnName("FGBrand");

                entity.Property(e => e.Fgcode)
                    .HasMaxLength(50)
                    .HasColumnName("FGCode");

                entity.Property(e => e.Fgdescription).HasColumnName("FGDescription");

                entity.Property(e => e.Fgid)
                    .HasMaxLength(50)
                    .HasColumnName("FGID");
            });

            modelBuilder.Entity<TblFgpalletCapacity>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblFGPalletCapacity");

                entity.Property(e => e.Fgcode)
                    .HasMaxLength(50)
                    .HasColumnName("FGCode");

                entity.Property(e => e.Fgpcid).HasColumnName("FGPCID");
            });

            modelBuilder.Entity<TblFileUploadLog>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblFileUploadLog");

                entity.Property(e => e.Action).HasMaxLength(50);

                entity.Property(e => e.AttachmentName).HasMaxLength(50);

                entity.Property(e => e.AttachmentPath).HasMaxLength(500);

                entity.Property(e => e.Ipaddress)
                    .HasMaxLength(50)
                    .HasColumnName("IPAddress");

                entity.Property(e => e.LogDateTime).HasColumnType("datetime");

                entity.Property(e => e.Page).HasMaxLength(50);

                entity.Property(e => e.StationName).HasMaxLength(100);

                entity.Property(e => e.SystemName)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblGlobalVariableSetting>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblGlobalVariableSetting");

                entity.Property(e => e.Value).HasMaxLength(100);

                entity.Property(e => e.VariableKey).HasMaxLength(100);
            });

            modelBuilder.Entity<TblGlove>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblGlove");

                entity.Property(e => e.GloveCode).HasMaxLength(50);

                entity.Property(e => e.GloveId)
                    .HasMaxLength(50)
                    .HasColumnName("GloveID");
            });

            modelBuilder.Entity<TblJournal>(entity =>
            {
                entity.HasKey(e => e.JournalId);

                entity.ToTable("tblJournal");

                entity.Property(e => e.AttachmentName).HasMaxLength(50);

                entity.Property(e => e.CreatedBy).HasMaxLength(150);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.CutOffDate).HasColumnType("date");

                entity.Property(e => e.Description).HasMaxLength(500);

                entity.Property(e => e.JournalNo).HasMaxLength(50);

                entity.Property(e => e.LocationId)
                    .HasMaxLength(10)
                    .IsFixedLength(true);

                entity.Property(e => e.Status).HasMaxLength(50);

                entity.Property(e => e.UpdatedBy).HasMaxLength(150);

                entity.Property(e => e.UpdatedOn).HasColumnType("datetime");
            });

            modelBuilder.Entity<TblLine>(entity =>
            {
                entity.HasKey(e => e.LineId)
                    .HasName("PK_Table_1");

                entity.ToTable("tblLine");

                entity.Property(e => e.BatchNo).HasMaxLength(50);

                entity.Property(e => e.BatchSerialNo).HasMaxLength(50);

                entity.Property(e => e.BinLocation).HasMaxLength(50);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.GloveType).HasMaxLength(50);

                entity.Property(e => e.PalletId).HasMaxLength(50);

                entity.Property(e => e.Size).HasMaxLength(50);

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.UpdatedOn).HasColumnType("datetime");
            });

            modelBuilder.Entity<TblLocation>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblLocation");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.LocationName).HasMaxLength(50);

                entity.Property(e => e.StationName).HasMaxLength(50);
            });

            modelBuilder.Entity<TblPallet>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblPallet");

                entity.Property(e => e.PalletId)
                    .HasMaxLength(50)
                    .HasColumnName("PalletID");
            });

            modelBuilder.Entity<TblPrinterSetting>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblPrinterSetting");

                entity.Property(e => e.ConnectionString).HasMaxLength(50);

                entity.Property(e => e.PrinterId).HasColumnName("PrinterID");

                entity.Property(e => e.PrinterName).HasMaxLength(50);
            });

            modelBuilder.Entity<TblReason>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblReason");

                entity.Property(e => e.ReasonCode).HasMaxLength(50);

                entity.Property(e => e.ReasonId).HasColumnName("ReasonID");
            });

            modelBuilder.Entity<TblStationPc>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStationPC");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.StationId).HasColumnName("StationID");

                entity.Property(e => e.StationName).HasMaxLength(50);
            });

            modelBuilder.Entity<TblStockCartonDetail>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockCartonDetails");

                entity.Property(e => e.ActualSo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualSO");

                entity.Property(e => e.ActualSocartonNo).HasColumnName("ActualSOCartonNo");

                entity.Property(e => e.ActualWo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualWO");

                entity.Property(e => e.CartonId)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("CartonID");

                entity.Property(e => e.LastModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.SterileDate).HasColumnType("datetime");

                entity.Property(e => e.StockCid)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("StockCID");

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");
            });

            modelBuilder.Entity<TblStockCartonDetailsBak>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockCartonDetails_bak");

                entity.Property(e => e.CartonId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("CartonID");

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");
            });

            modelBuilder.Entity<TblStockCartonDetailsBak181127>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockCartonDetails_bak_181127");

                entity.Property(e => e.ActualSo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualSO");

                entity.Property(e => e.ActualSocartonNo).HasColumnName("ActualSOCartonNo");

                entity.Property(e => e.ActualWo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualWO");

                entity.Property(e => e.CartonId)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("CartonID");

                entity.Property(e => e.LastModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.StockCid)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("StockCID");

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");
            });

            modelBuilder.Entity<TblStockDetail>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockDetails");

                entity.Property(e => e.BatchLotNo).HasMaxLength(50);

                entity.Property(e => e.BatchMfgDate).HasColumnType("datetime");

                entity.Property(e => e.BatchSerialNo).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ExpiryDate).HasColumnType("datetime");

                entity.Property(e => e.Fgcode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("FGCode");

                entity.Property(e => e.ForecastSo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastSO");

                entity.Property(e => e.ForecastWo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastWO");

                entity.Property(e => e.Qaidate)
                    .HasColumnType("datetime")
                    .HasColumnName("QAIDate");

                entity.Property(e => e.Size)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblStockDetailsBak>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockDetails_bak");

                entity.Property(e => e.BatchLotNo).HasMaxLength(50);

                entity.Property(e => e.BatchMfgDate).HasColumnType("datetime");

                entity.Property(e => e.BatchSerialNo).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblStockDetailsBak181127>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockDetails_bak_181127");

                entity.Property(e => e.BatchLotNo).HasMaxLength(50);

                entity.Property(e => e.BatchMfgDate).HasColumnType("datetime");

                entity.Property(e => e.BatchSerialNo).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ExpiryDate).HasColumnType("datetime");

                entity.Property(e => e.Fgcode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("FGCode");

                entity.Property(e => e.ForecastSo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastSO");

                entity.Property(e => e.ForecastWo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastWO");

                entity.Property(e => e.Qaidate)
                    .HasColumnType("datetime")
                    .HasColumnName("QAIDate");

                entity.Property(e => e.Size)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblStockDetailsBk05042019>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockDetails_BK05042019", "HARTALEGA\\surendran.chandra");

                entity.Property(e => e.BatchLotNo).HasMaxLength(50);

                entity.Property(e => e.BatchMfgDate).HasColumnType("datetime");

                entity.Property(e => e.BatchSerialNo).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ExpiryDate).HasColumnType("datetime");

                entity.Property(e => e.Fgcode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("FGCode");

                entity.Property(e => e.ForecastSo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastSO");

                entity.Property(e => e.ForecastWo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastWO");

                entity.Property(e => e.Qaidate)
                    .HasColumnType("datetime")
                    .HasColumnName("QAIDate");

                entity.Property(e => e.Size)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblStockMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockMaster");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Fgid)
                    .HasMaxLength(50)
                    .HasColumnName("FGID");

                entity.Property(e => e.GloveId)
                    .HasMaxLength(50)
                    .HasColumnName("GloveID");

                entity.Property(e => e.GloveSize).HasMaxLength(5);

                entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.ModuleId).HasColumnName("ModuleID");

                entity.Property(e => e.NextLocation).HasMaxLength(50);

                entity.Property(e => e.NowLocation).HasMaxLength(50);

                entity.Property(e => e.OriLocation).HasMaxLength(50);

                entity.Property(e => e.OriStation).HasMaxLength(50);

                entity.Property(e => e.PalletId)
                    .HasMaxLength(50)
                    .HasColumnName("PalletID");

                entity.Property(e => e.ReasonId).HasColumnName("ReasonID");

                entity.Property(e => e.ScanningTime).HasColumnType("datetime");

                entity.Property(e => e.StockId).HasColumnName("StockID");
            });

            modelBuilder.Entity<TblStockMasterBak>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockMaster_bak");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Fgid)
                    .HasMaxLength(50)
                    .HasColumnName("FGID");

                entity.Property(e => e.GloveId)
                    .HasMaxLength(50)
                    .HasColumnName("GloveID");

                entity.Property(e => e.GloveSize).HasMaxLength(5);

                entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.NextLocation).HasMaxLength(50);

                entity.Property(e => e.NowLocation).HasMaxLength(50);

                entity.Property(e => e.OriLocation).HasMaxLength(50);

                entity.Property(e => e.OriStation).HasMaxLength(50);

                entity.Property(e => e.PalletId)
                    .HasMaxLength(50)
                    .HasColumnName("PalletID");

                entity.Property(e => e.ReasonId).HasColumnName("ReasonID");

                entity.Property(e => e.StockId).HasColumnName("StockID");
            });

            modelBuilder.Entity<TblStockMasterBak181127>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockMaster_bak_181127");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Fgid)
                    .HasMaxLength(50)
                    .HasColumnName("FGID");

                entity.Property(e => e.GloveId)
                    .HasMaxLength(50)
                    .HasColumnName("GloveID");

                entity.Property(e => e.GloveSize).HasMaxLength(5);

                entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.NextLocation).HasMaxLength(50);

                entity.Property(e => e.NowLocation).HasMaxLength(50);

                entity.Property(e => e.OriLocation).HasMaxLength(50);

                entity.Property(e => e.OriStation).HasMaxLength(50);

                entity.Property(e => e.PalletId)
                    .HasMaxLength(50)
                    .HasColumnName("PalletID");

                entity.Property(e => e.ReasonId).HasColumnName("ReasonID");

                entity.Property(e => e.StockId).HasColumnName("StockID");
            });

            modelBuilder.Entity<TblStockTransaction>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockTransaction");

                entity.Property(e => e.ActualSo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualSO");

                entity.Property(e => e.ActualWo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualWO");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.CartonCapacity).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.CartonId)
                    .HasMaxLength(50)
                    .HasColumnName("CartonID");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.EmployeeId)
                    .HasMaxLength(50)
                    .HasColumnName("EmployeeID");

                entity.Property(e => e.ForecastSo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastSO");

                entity.Property(e => e.ForecastWo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastWO");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.Remarks).HasMaxLength(50);

                entity.Property(e => e.StationName).HasMaxLength(50);

                entity.Property(e => e.Stid).HasColumnName("STID");

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblStockTransactionBak>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockTransaction_bak");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.CartonCapacity).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.CartonId).HasColumnName("CartonID");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.StationName).HasMaxLength(50);

                entity.Property(e => e.Stid).HasColumnName("STID");

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblStockTransactionBak181127>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblStockTransaction_bak_181127");

                entity.Property(e => e.ActualSo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualSO");

                entity.Property(e => e.ActualWo)
                    .HasMaxLength(50)
                    .HasColumnName("ActualWO");

                entity.Property(e => e.BinId).HasColumnName("BinID");

                entity.Property(e => e.CartonCapacity).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.CartonId)
                    .HasMaxLength(50)
                    .HasColumnName("CartonID");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");

                entity.Property(e => e.ForecastSo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastSO");

                entity.Property(e => e.ForecastWo)
                    .HasMaxLength(50)
                    .HasColumnName("ForecastWO");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.StationName).HasMaxLength(50);

                entity.Property(e => e.Stid).HasColumnName("STID");

                entity.Property(e => e.StockDid).HasColumnName("StockDID");

                entity.Property(e => e.StockId).HasColumnName("StockID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblSysLog>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblSysLog");

                entity.Property(e => e.Action).HasMaxLength(50);

                entity.Property(e => e.Ipaddress)
                    .HasMaxLength(50)
                    .HasColumnName("IPAddress");

                entity.Property(e => e.LogDateTime).HasColumnType("datetime");

                entity.Property(e => e.Page).HasMaxLength(50);

                entity.Property(e => e.StationName).HasMaxLength(100);

                entity.Property(e => e.SystemName)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblUser>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblUser");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.Password).HasMaxLength(50);

                entity.Property(e => e.StationId).HasColumnName("StationID");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.Username).HasMaxLength(50);
            });

            modelBuilder.Entity<TblUserLocation>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblUserLocation");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<TblUserLog>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("tblUserLog");

                entity.Property(e => e.Ip)
                    .HasMaxLength(50)
                    .HasColumnName("IP");

                entity.Property(e => e.LogDate).HasColumnType("datetime");

                entity.Property(e => e.StationName).HasMaxLength(50);

                entity.Property(e => e.UlogGuid)
                    .HasMaxLength(50)
                    .HasColumnName("UlogGUID");

                entity.Property(e => e.UlogId).HasColumnName("UlogID");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
