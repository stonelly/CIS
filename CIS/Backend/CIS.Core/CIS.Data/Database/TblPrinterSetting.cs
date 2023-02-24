using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblPrinterSetting
    {
        public int? PrinterId { get; set; }
        public string PrinterName { get; set; }
        public string ConnectionString { get; set; }
        public byte? PrinterType { get; set; }
        public byte? Status { get; set; }
        public bool? Del { get; set; }
    }
}
