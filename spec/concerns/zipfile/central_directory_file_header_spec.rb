require 'rails_helper'

describe Zipfile::CentralDirectoryFileHeader do
  let(:test_string) {
    "PK\u0001\u0002\u0014\u0000\u0014\u0000\b\b\b\u0000\xA7\xBAQQ\xAEo\xB0\xC0V\u0003\u0000\u0000\xFF/\u0000\u0000\u0012\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\xAC$\u0000\u0000word/numbering.xml"
  }
#     signature=33639248, version_used=20, version_needed=20, 
#         bit_flag=2056, compression_method=8, modified_time=-17753, 
#         modified_date=20817, crc=-1062178898, compressed_size=854, 
#         uncompressed_size=12287, file_name_length=18, extra_field_length=0, 
#         file_comment_length=0, file_start_disk=0, internal_attributes=0, 
#         external_attributes=0, file_header_relative_offset=9388, string_data="word/numbering.xml">>,

  let(:cdfh) { Zipfile::CentralDirectoryFileHeader.new(test_string)}

  it "instantiates" do
    expect(cdfh).to be_an_instance_of(Zipfile::CentralDirectoryFileHeader)
  end

  it "throws an error if the signature is wrong" do
    expect { 
      Zipfile::CentralDirectoryFileHeader.new(test_string[3..-1]) 
    }.to raise_error(Zipfile::InvalidCentralDirectoryFileHeaderRecord)
  end

  it "returns the file name" do
    expect(cdfh.file_name).to eq('word/numbering.xml')
  end

  it "returns the record length" do
    expect(cdfh.size).to eq(64)
  end

  it "returns a response for a delegated message" do
    expect(cdfh.uncompressed_size).to eq(12287)
  end

  it "instantiates when the string has data past the end" do
    cdfh2 = Zipfile::CentralDirectoryFileHeader.new(test_string + 'al;kseiopqw2w3478q234uiwerjklsd')
    expect(cdfh2).to be_an_instance_of(Zipfile::CentralDirectoryFileHeader)
    expect(cdfh2.size).to eq(64)
    expect(cdfh2.file_name).to eq('word/numbering.xml')
  end
end
