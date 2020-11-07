require 'rails_helper'

describe "EndOfCentralDirectory" do

  let(:test_string) { "PK\u0005\u0006\u0000\u0000\u0000\u0000\v\u0000\v\u0000\xC8\u0002\u0000\u0000\v1\u0000\u0000\u0000\u0000" }
      # signature=101010256, disk_number=0, cd_start_disk=0, cd_records_this_disk=11, 
      # cd_records_total=11, cd_size=712, cd_offset=12555, comment_length=0, comment=""
  
  let(:eocd) { Zipfile::EndOfCentralDirectory.new(test_string) }

  it "instantiates an exact string" do
    expect(eocd).to be_an_instance_of(Zipfile::EndOfCentralDirectory)
  end

  it "instantiates a string with data in front" do
    eocd = Zipfile::EndOfCentralDirectory.new('al;sl;dfopuaoiwu80234ow3rtj' + test_string)
    expect(eocd).to be_an_instance_of(Zipfile::EndOfCentralDirectory)
  end

  it "errors without the signature" do
    expect{ 
      Zipfile::EndOfCentralDirectory.new(test_string[3..-1]) 
    }.to raise_error(Zipfile::InvalidEndOfCentralDirectoryRecord)
  end

  it "returns size" do
    expect(eocd.size).to eq(22)
  end

  it "returns cd_size" do
    expect(eocd.cd_size).to eq(712)
  end
end
