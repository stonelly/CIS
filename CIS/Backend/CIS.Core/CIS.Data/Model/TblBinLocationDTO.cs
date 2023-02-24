using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class TblBinLocationDTO
    {
        public int? BinId { get; set; }
        public int? LocationId { get; set; }
        public string BinLocationName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? BinDid { get; set; }
    }
}
