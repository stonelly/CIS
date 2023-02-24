using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class DNSTOCKDTO
    {
        public string STOCK_ID { get; set; }
        public string AREA_NO { get; set; }
        public string LOCATION_NO { get; set; }
        public string PALLET_NO { get; set; }
        public string CONSIGNOR_CODE { get; set; }
        public string ITEM_CODE { get; set; }
        public string QA_FLAG { get; set; }
        public string LOT_NO { get; set; }
        public string PO_NO { get; set; }
        public string SO_NO { get; set; }
        public string STORAGE_DAY { get; set; }
        public DateTime? STORAGE_DATE { get; set; }
        public string RETRIEVAL_DAY { get; set; }
        public int STOCK_QTY { get; set; }
        public int ALLOCATION_QTY { get; set; }
        public int PLAN_QTY { get; set; }
        public string PALLET_ID { get; set; }
        public DateTime REGIST_DATE { get; set; }
        public string REGIST_PNAME { get; set; }
        public DateTime LAST_UPDATE_DATE { get; set; }
        public string LAST_UPDATE_PNAME { get; set; }
        public string WAREHOUSE_CODE { get; set; }
        public DateTime PLAN_DAY { get; set; }
    }
}
