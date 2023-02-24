using CIS.Data.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class PalletInfoDTO
    {
        public string ErrorMessage { get; set; }
        public bool IsValidCheckIn { get; set; }
        public string PalletNo { get; set; }
        public string PalletType { get; set; }
        public int? StockId { get; set; }
        public List<EWN_CompletedPalletDTO> EWN_CompletedPalletList { get; set; }
        public List<PalletDetailDTO> PalletDetailList { get; set; }
        public List<TblBinLocation> tblBinLocation { get; set; }

    }
}
