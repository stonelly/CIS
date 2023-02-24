using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblStockMaster
    {
        public int? StockId { get; set; }
        public string PalletId { get; set; }
        public string GloveId { get; set; }
        public int? CategoryId { get; set; }
        public string Fgid { get; set; }
        public int? ReasonId { get; set; }
        public int? TotalCapacity { get; set; }
        public DateTime? LastUpdatedDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public string OriLocation { get; set; }
        public string OriStation { get; set; }
        public string NextLocation { get; set; }
        public string GloveSize { get; set; }
        public int? TotalCarton { get; set; }
        public string NowLocation { get; set; }
        public int? BinId { get; set; }
        public DateTime? ScanningTime { get; set; }
        public int? ModuleId { get; set; }
    }
}
