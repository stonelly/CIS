using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class EWN_CompletedPalletDTO
    {
        public int? QAPassed { get; set; }
        public string Item { get; set; }
        public string PONumber { get; set; }
        public int? Qty { get; set; }
        public string PalletId { get; set; }
        public DateTime? DateCompleted { get; set; }
        public DateTime? DateStockOut { get; set; }
        public string CustomerPONumber { get; set; }
        public DateTime PlanDay { get; set; }
    }
}
