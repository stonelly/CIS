using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblFgpalletCapacity
    {
        public int? Fgpcid { get; set; }
        public string Fgcode { get; set; }
        public int? MaxPalletCarton { get; set; }
        public bool? Del { get; set; }
    }
}
