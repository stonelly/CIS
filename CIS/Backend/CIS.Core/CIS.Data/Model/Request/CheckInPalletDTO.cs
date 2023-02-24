using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model.Request
{
    public class CheckInPalletDTO
    {
        public string UserId { get; set; }
        public string PalletType { get; set; }
        public string PalletNo { get; set; }
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public int StockId { get; set; }
        public string EmployeeId { get; set; }
        public int BinLocationId { get; set; }
        public string StationName { get; set; }
        public string MachineIP { get; set; }
        public string Plant { get; set; }
        public List<EWN_CompletedPalletDTO> eWN_CompletedPalletList { get; set; }
    }
}
