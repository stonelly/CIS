using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class EwnTblStationPcDTO
    {
        public int? StationId { get; set; }
        public string StationName { get; set; }
        public int? LocationId { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public string LocationName { get; set; }
    }
}
