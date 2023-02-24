using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class EwnTblLocationDTO
    {
        public int LocationId { get; set; }
        public byte? LocationType { get; set; }
        public string LocationName { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public string StationName { get; set; }
        public string LocationTypeName { get; set; }
        public string PlantName { get; set; }
    }
}
