using CIS.Common.Helper;
using CIS.Common.Utils;
using CIS.Data.Model;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Services.Service
{
    public class FloorSystemrService : IFloorSystemrService
    {
        private SqlConnection _floorSystemConnection;
        private readonly AppSettings _appSettings;

        public FloorSystemrService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _floorSystemConnection = new SqlConnection(appSettings.Value.FloorSystemConnection);
        } 
        public async Task<List<EWN_CompletedPalletDTO>> USP_EWN_GetPalletData(string palletID)
        {
            List < EWN_CompletedPalletDTO> palletLst = new List<EWN_CompletedPalletDTO>();

            try
            {
                _floorSystemConnection.Open();
                SqlCommand selectCommand = new SqlCommand("usp_EWN_GetPalletData");
                selectCommand.Parameters.Add("@palletID", SqlDbType.NVarChar).Value = (object)palletID;
                selectCommand.Connection = _floorSystemConnection;
                selectCommand.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(selectCommand);
                sqlDataAdapter.SelectCommand.CommandTimeout = 300;
                DataSet dataSet = new DataSet();

                await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                if (dataSet.Tables[0].Rows.Count > 0)
                {

                    foreach (DataRow row in dataSet.Tables[0].Rows)
                    {
                        EWN_CompletedPalletDTO palletDTO = new EWN_CompletedPalletDTO();

                        palletDTO.QAPassed = DataTypeUtils.SaveConvert(row["QAPassed"], (int?)null);
                        palletDTO.Item = DataTypeUtils.SaveConvert(row["Item"], "");
                        palletDTO.PONumber = DataTypeUtils.SaveConvert(row["PONumber"], "");
                        palletDTO.Qty = DataTypeUtils.SaveConvert(row["Qty"], (int?)null);
                        palletDTO.PalletId = DataTypeUtils.SaveConvert(row["PalletId"], "");
                        palletDTO.DateCompleted = DataTypeUtils.SaveConvert(row["DateCompleted"], (DateTime?)null);
                        palletDTO.DateStockOut = DataTypeUtils.SaveConvert(row["DateStockOut"], (DateTime?)null);

                        palletLst.Add(palletDTO);


                    }
                    // should not only show fist line
                    //DataRow row = dataSet.Tables[0].Rows[0];

                    //palletDTO.QAPassed = DataTypeUtils.SaveConvert(row["QAPassed"], (int?)null);
                    //palletDTO.Item = DataTypeUtils.SaveConvert(row["Item"], "");
                    //palletDTO.PONumber = DataTypeUtils.SaveConvert(row["PONumber"], "");
                    //palletDTO.Qty = DataTypeUtils.SaveConvert(row["Qty"], (int?)null);
                    //palletDTO.PalletId = DataTypeUtils.SaveConvert(row["PalletId"], "");
                    //palletDTO.DateCompleted = DataTypeUtils.SaveConvert(row["DateCompleted"], (DateTime?)null);
                    //palletDTO.DateStockOut = DataTypeUtils.SaveConvert(row["DateStockOut"], (DateTime?)null);

                    //palletLst.Add(palletDTO);
                }
               

            }
            catch(Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_floorSystemConnection.State == ConnectionState.Open)
                    _floorSystemConnection.Close();
            }
          
            return palletLst;
        }

        public async Task<int> FSPostD365FromFGReceivedPallet(string palletID, string plantNo, DateTime dateScanned)
        {
            int result = 0; 
            try
            {
                _floorSystemConnection.Open();
                SqlCommand selectCommand = new SqlCommand("USP_DOT_FSPostD365FromFGReceivedPallet");
                selectCommand.Connection = _floorSystemConnection;
                selectCommand.CommandType = CommandType.StoredProcedure;

                selectCommand.Parameters.Add("@PalletID", SqlDbType.NVarChar).Value = (object)palletID;
                selectCommand.Parameters.Add("@PlantNo", SqlDbType.NVarChar).Value = (object)plantNo;
                selectCommand.Parameters.Add("@DateScanned", SqlDbType.DateTime).Value = (object)dateScanned;
                selectCommand.Parameters.Add("@Return", SqlDbType.Int);
                selectCommand.Parameters["@Return"].Direction = ParameterDirection.Output;
                selectCommand.CommandTimeout = 120;


                int i = await selectCommand.ExecuteNonQueryAsync();
                result = Convert.ToInt32(selectCommand.Parameters["@Return"].Value);

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_floorSystemConnection.State == ConnectionState.Open)
                    _floorSystemConnection.Close();
            }

            return result;
        }

        public async Task<Boolean> USP_EWN_ValidateIOTPallet(string palletID)
        {
            Boolean isIOTScanned = false;

            try
            {
                _floorSystemConnection.Open();
                SqlCommand selectCommand = new SqlCommand("USP_EWN_ValidateIOTPallet");
                selectCommand.Parameters.Add("@palletID", SqlDbType.NVarChar).Value = (object)palletID;
                selectCommand.Connection = _floorSystemConnection;
                selectCommand.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(selectCommand);
                sqlDataAdapter.SelectCommand.CommandTimeout = 300;
                DataSet dataSet = new DataSet();

                await Task.Run(() => sqlDataAdapter.Fill(dataSet));

                if (dataSet.Tables[0].Rows.Count > 0)
                {
                    EWN_CompletedPalletDTO palletDTO = new EWN_CompletedPalletDTO();
                    DataRow row = dataSet.Tables[0].Rows[0];

                    isIOTScanned = DataTypeUtils.SaveConvert(row["isIOTScanned"], false);
                }
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_floorSystemConnection.State == ConnectionState.Open)
                    _floorSystemConnection.Close();
            }

            return isIOTScanned;
        }

        public async Task<Boolean> USP_EWN_UpdPalletCompltScannedTimeByCIS(string palletID)
        {
            Boolean isIOTScanned = false;

            try
            {
                _floorSystemConnection.Open();
                SqlCommand selectCommand = new SqlCommand("USP_EWN_UpdPalletCompltScannedTimeByCIS");
                selectCommand.Parameters.Add("@palletID", SqlDbType.NVarChar).Value = (object)palletID;
                selectCommand.Connection = _floorSystemConnection;
                selectCommand.CommandType = CommandType.StoredProcedure;

                await selectCommand.ExecuteReaderAsync();
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_floorSystemConnection.State == ConnectionState.Open)
                    _floorSystemConnection.Close();
            }

            return isIOTScanned;
        }
    }
}
