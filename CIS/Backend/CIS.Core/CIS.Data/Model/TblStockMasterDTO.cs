using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class TblStockMasterDTO
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
    }
}
