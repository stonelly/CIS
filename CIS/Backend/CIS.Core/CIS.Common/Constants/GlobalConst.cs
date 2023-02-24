using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Common.Constants
{
    public static class GlobalConst
    {
        //public static TPIS.DAL.dbConn p = new TPIS.DAL.dbConn();
        //public static SqlConnection objconn = p.EstablishConnection1();
        public enum StockMTO_MTS
        {
            None = 0,
            MTO = 1,
            MTS = 2,
        }
        public const string PALLETTYPE_MTO = "MTO";
        public const string PALLETTYPE_MTS = "MTS";
        public const string AREANO_STAG = "STAG";
        public static string GetSystemName()
        {
            string value = "";
            value = "WMS-OBP";
            return value;
        }

        public enum RecordStatus
        {
            InActive = 0,
            Action = 1,
        }

        public enum pageaction
        {
            View = 0,
            AddNew = 1,
            Edit = 2,
            Remove = 3
        }
        public enum LocationTypeID
        {
            Production = 1,
            Warehouse = 2,
            Special = 3,
        }
        public static string[] LocationType = new string[2] { "Production", "Warehouse" };
        public static string GetLocationTypeString(int id)
        {
            string value = "";
            switch (id)
            {
                case (int)LocationTypeID.Production: value = "Production"; break;
                case (int)LocationTypeID.Warehouse: value = "Warehouse"; break;
            }
            return value;
        }
        public static int GetLocationTypeID(string name)
        {
            int value = 0;
            switch (name)
            {
                case "Production": value = (int)LocationTypeID.Production; break;
                case "Warehouse": value = (int)LocationTypeID.Warehouse; break;
            }
            return value;
        }
        public enum StockTransactionType
        {
            Register = 1,
            Complete = 2,   //FGTF Register from Final Pack
            ScanIn = 3,
            ScanOut = 4,
            ScanOutBatch = 5,
            ScanOutCarton = 6,
            ReRegister = 7,
            CombinePallet = 8,
            //200311 - new add for transaction report
            ReRegisterComplete = 10,
            IntercoComplete = 11,
        }

        public enum PalletStatus
        {
            Available = 1,
            RegisterNAvailable = 2,
            Lock = 3,
            Release = 4,
            NotAvailable = 5

            //1 = lock
            //0 = open
        }

        public enum BinStatus
        {
            Open = 1,
            Close = 2
        }

        #region User Access Level
        public enum AccessLevel
        {
            ProductionUser = 1,
            ProductionSupervisor = 2,
            WarehouseUser = 3,
            WarehouseSupervisor = 4,
            Finance = 5,
            Admin = 10
        }
        public static string GetAccessLevelString(int id)
        {
            string value = "";
            switch (id)
            {
                case (int)AccessLevel.ProductionUser: value = "Production - User"; break;
                case (int)AccessLevel.ProductionSupervisor: value = "Production - Supervisor"; break;
                case (int)AccessLevel.WarehouseUser: value = "Warehouse - User"; break;
                case (int)AccessLevel.WarehouseSupervisor: value = "Warehouse - Supervisor"; break;
                case (int)AccessLevel.Finance: value = "Finance"; break;
                case (int)AccessLevel.Admin: value = "Admin"; break;
            }
            return value;
        }
        public static int GetAccessLevelID(string name)
        {
            int value = 0;
            switch (name)
            {
                case "Production - User": value = (int)AccessLevel.ProductionUser; break;
                case "Production - Supervisor": value = (int)AccessLevel.ProductionSupervisor; break;
                case "Warehouse - User": value = (int)AccessLevel.WarehouseUser; break;
                case "Warehouse - Supervisor": value = (int)AccessLevel.WarehouseSupervisor; break;
                case "Finance": value = (int)AccessLevel.Finance; break;
                case "Admin": value = (int)AccessLevel.Admin; break;
            }
            return value;
        }
        #endregion

        // Lakshman Murthy Created On 2-6-2017
        #region Journal And Line Status
        public enum JournalAndLineStatus
        {
            Pending = 0,
            SupervisorApproved = 1,
            FinanceApproved = 2,
            Recount = 3
        }
        #endregion


        #region Normal Status
        public enum Status
        {
            Active = 1,
            Inactive = 2
        }
        public static string[] StatusString = new string[2] { "Active", "Removed" };
        public static string GetStatusString(string id)
        {
            string value = "";
            switch (id)
            {
                case "1": value = "Active"; break;
                case "2": value = "Removed"; break;
            }
            return value;
        }
        public static int GetStatusID(string name)
        {
            int value = 0;
            switch (name)
            {
                case "Active": value = 1; break;
                case "Removed": value = 2; break;
            }
            return value;
        }
        #endregion


        public enum CheckinModule
        {
            CheckInStation = 1,
            IOT = 2
        }

        //--->>> Stock Status
        #region StockStatus
        public enum StockStatus
        {
            Open = 1,
            Confirm = 2,
            Warehouse = 3,
            Close = 4,
            Complete = 5
        }
        public static string GetStockStatusString(int id)
        {
            string value = "";
            switch (id)
            {
                case (int)GlobalConst.StockStatus.Open: value = "Open"; break;
                case (int)GlobalConst.StockStatus.Confirm: value = "Confirm"; break;
                case (int)GlobalConst.StockStatus.Close: value = "Close"; break;
                case (int)GlobalConst.StockStatus.Complete: value = "Complete"; break;
            }
            return value;
        }
        public static int GetStockStatusID(string name)
        {
            int value = 0;
            switch (name)
            {
                case "Open": value = (int)GlobalConst.StockStatus.Open; break;
                case "Confirm": value = (int)GlobalConst.StockStatus.Confirm; break;
                case "Close": value = (int)GlobalConst.StockStatus.Close; break;
                case "Complete": value = (int)GlobalConst.StockStatus.Complete; break;
                case "Warehouse": value = (int)GlobalConst.StockStatus.Warehouse; break;
            }
            return value;
        }
        public static string GetStockTransactionTypeString(string id)
        {
            string value = "";
            switch (id)
            {
                case "1": value = "Register"; break; //
                case "2": value = "FGTF Register(Final Pack)"; break; //COmplete Pallet
                case "3": value = "Scan In"; break;
                case "4": value = "Scan Out"; break;
                case "5": value = "Scan Out-Batch"; break;
                case "6": value = "Scan Out-Carton"; break;
                case "7": value = "ReRegister"; break;
                case "8": value = "Combine Pallet"; break;
                case "10": value = "ReRegister Complete Pallet"; break;
                case "11": value = "Interco Complete Pallet"; break;

            }
            return value;
        }

        #endregion

        #region General Coding for C#

        public static bool IsNumeric(string test)
        {
            bool value = false;
            double num;
            if (double.TryParse(test, out num))
            { value = true; }
            return value;
        }
        #endregion



        public const string Submit_Token = "SUBMIT_TOKEN";
    }
}
