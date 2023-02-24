using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblDbfdatum
    {
        public string Fgcode { get; set; }
        public int PalletSize { get; set; }
        public DateTime? DateInserted { get; set; }
    }
}
