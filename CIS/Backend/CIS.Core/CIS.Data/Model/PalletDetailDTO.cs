using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class PalletDetailDTO
    {
        public string CartonID { get; set; }
        public int CartonNo { get; set; }
        public string BatchLotNo { get; set; }
        public string FGCode { get; set; }
        public string Size { get; set; }
        public string ForecastSO { get; set; }
        public string ForecastWO { get; set; }
        public DateTime? QAIDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? BatchMfgDate { get; set; }
        public int? InnerBoxPerCarton { get; set; }
        public int? InnerBoxPackingSize { get; set; }
        public int? StockID { get; set; }
        public string NextLocation { get; set; }
        public int? StockDID { get; set; }
        public int? CartonCapacity { get; set; }
        public string NowLocationName { get; set; }
        public string BinLocationName { get; set; }
        public int? BinId { get; set; }
        public int? Aging { get; set; }
        public int BlockAging { get; set; }
        public int BlockExpired { get; set; }
    }
}
