using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblPallet
    {
        public string PalletId { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
    }
}
