using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblFgmaster
    {
        public string Fgid { get; set; }
        public string Fgcode { get; set; }
        public string Fgbrand { get; set; }
        public string Fgdescription { get; set; }
        public int? MaxPalletCarton { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
        public int? MinStockThreshold { get; set; }
        public int? MaxStockThreshold { get; set; }
    }
}
