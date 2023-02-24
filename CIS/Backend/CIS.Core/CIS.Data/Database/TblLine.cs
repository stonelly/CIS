using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblLine
    {
        public long LineId { get; set; }
        public long? JournalId { get; set; }
        public string PalletId { get; set; }
        public long? LocationId { get; set; }
        public string BatchNo { get; set; }
        public string BatchSerialNo { get; set; }
        public string GloveType { get; set; }
        public string Size { get; set; }
        public long? OnHandCount { get; set; }
        public long? ActualCount { get; set; }
        public long? Varience { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public bool? Del { get; set; }
        public string BinLocation { get; set; }
        public int? StockDid { get; set; }
    }
}
