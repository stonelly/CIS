using AutoMapper;
using CIS.Data.Database;
using CIS.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CIS.Core.Mapping
{
    public class MappingProfile : Profile
    {       
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<TblStockMaster, TblStockMasterDTO>();
            CreateMap<TblStockMasterDTO, TblStockMaster>();

            //CreateMap<EwnTblStationPc, EwnTblStationPcDTO>();
            //CreateMap<EwnTblStationPcDTO, EwnTblStationPc>();

            //CreateMap<List<EwnTblStationPcDTO>, List<EwnTblStationPc>>();
            //CreateMap< List<EwnTblStationPc>, List<EwnTblStationPcDTO>>();

            //CreateMap<EwnTblLocation, EwnTblLocationDTO>();
            //CreateMap<EwnTblLocationDTO, EwnTblLocation>();

            //CreateMap<List<EwnTblLocationDTO>, List<EwnTblLocation>>();
            //CreateMap<List<EwnTblLocation>, List<EwnTblLocationDTO>>();

            //CreateMap<EwnTblLocation, TblLocation>();
            //CreateMap<TblLocation, EwnTblLocation>();

            CreateMap<TblBinLocation, TblBinLocationDTO>();
            CreateMap<TblBinLocationDTO, TblBinLocation>();

            CreateMap<List<TblBinLocationDTO>, List<TblBinLocation>>();
            CreateMap<List<TblBinLocation>, List<TblBinLocationDTO>>();

        }
    }
}
